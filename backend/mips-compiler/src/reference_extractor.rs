use goblin::Object;
use std::error::Error;

#[derive(Debug)]
pub enum SegmentType {
    Text,
}

#[derive(Debug)]
pub struct Segment {
    pub kind: SegmentType,
    pub alignment: u64,
    pub data: Vec<u8>,
}

pub fn get_text(program: Vec<u8>) -> Result<Option<Segment>, Box<Error>> {
    let mut text_seg = None;

    let program_object = match Object::parse(&program).unwrap() {
        Object::Elf(elf) => elf,
        _ => bail!("Program was not in the ELF format"),
    };

    let section_header_names = program_object.shdr_strtab;
    for section_header in program_object.section_headers {
        let name = section_header_names.get(section_header.sh_name).unwrap()?;
        if name == ".text" {
            let offset = section_header.sh_offset;
            let size = section_header.sh_size;
            let addralign = section_header.sh_addralign;

            let data = &program[(offset as usize)..((offset + size) as usize)];

            let segment = Segment {
                kind: SegmentType::Text,
                alignment: addralign,
                data: data.into(),
            };

            text_seg = Some(segment);
        }
    }

    Ok(text_seg)
}
